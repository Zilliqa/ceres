const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express()
const port = 3939

app.use(bodyParser.json());
app.use(cors());
var http = require('http').createServer(app);


const { Docker } = require('node-docker-api');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const registerInNetwork = async (containerData) => {
    const exists = await docker.network.list({ filters: { "name": ["ceresnetwork"] } });

    console.log(exists);

    if (exists.length === 0) {
        docker.network.create({ name: 'ceresnetwork' }).then(async network => {
            await network.connect(containerData);
        });
    } else {
        const network = docker.network.get({ id: exists[0].Id });
        await network.connect(containerData);
    }

}

const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
});


app.get('/container/running', (req, res) => {
    docker.container.list({ filters: { "label": ["ceres"] } })
        // Inspect
        .then(containers => {
            const list = containers.map(item => item.data);

            res.json(list);
        })
        .catch(error => console.log(error));
});

app.get('/container/list', (req, res) => {
    docker.container.list({ all: true, filters: { "label": ["ceres"] } })
        // Inspect
        .then(containers => {
            const list = containers.map(item => item.data);

            res.json(list);
        })
        .catch(error => console.log(error));
});

const startContainer = async (image) => {
    const containers = await docker.container.list({ all: true, filters: { "label": ["ceres"] } });

    const exists = containers.find(item => item.data.Labels.ceres === image.ceres);

    if (exists !== undefined) {
        await exists.start();

        const status = await exists.status();

        return status.data;
    } else {
        const createOptions = {
            Image: `${image.ceres}:latest`,
            name: image.ceres,
            Labels: {
                "ceres": image.ceres,
                "containerPort": image.containerPort,
                "hostPort": image.hostPort,
                "name": image.name
            },
            HostConfig: {
                PortBindings: {}
            },
            ExposedPorts: {}
        };
        createOptions['HostConfig']['PortBindings'][image.containerPort] = [
            { "HostPort": image.hostPort }
        ];
        createOptions['ExposedPorts'][image.containerPort] = {};

        const container = await docker.container.create(createOptions);
        await registerInNetwork({ Container: container.data.Id });
        await container.start();

        const status = await container.status();
        return status.data;
    }
}

app.post('/container/start', (req, res) => {
    const image = req.body.image || undefined;

    docker.container.list({ all: true, filters: { "label": ["ceres"] } })
        .then(containers => {
            const exists = containers.find(item => item.data.Labels.ceres === image);

            if (exists !== undefined) {
                exists.start().then(async (container) => {
                    await registerInNetwork({ Container: container.data.Id });
                    const status = await container.status();

                    res.json(status.data);
                })

                    .catch(error => res.json(error.json));
            } else {
                res.end('Container not found. Please reinstall Service Image');
            }
        })
        .catch(error => res.json(error.json));
});

app.post('/container/stop', (req, res) => {
    const id = req.body.id;

    const container = docker.container.get(id);

    container.stop()
        .then(response => res.json(response))
        .catch(error => res.json(error.json));
})

app.post('/container/status', (req, res) => {
    const id = req.body.id;

    try {
        const container = docker.container.get(id);
        container.status().then(status => {
            res.json(status.data);
        })
    } catch (error) {
        res.json(error);
    }

});

app.get('/image/list', (req, res) => {
    docker.image.list({ filters: { "label": ["ceres"] } })
        .then(images => {
            res.json(images);
        })
});

app.get('/image/available', (req, res) => {
    const images = [
        {
            name: "Isolated Server Instance",
            image: "isolatedserver",
            tarbal:
                "isolatedserver.tar.gz",
            labels: {
                name: "Isolated Server Instance",
                ceres: "isolatedserver",
                containerPort: "5555",
                hostPort: "5555",
            },
            installed: false,
        },
        {
            name: "Isolated Server Faucet",
            image: "isolatedserverfaucet",
            tarbal:
                "isolatedserverfaucet.tar.gz",
            labels: {
                name: "Isolated Server Faucet",
                ceres: "isolatedserverfaucet",
                containerPort: "5556",
                hostPort: "5556",
            },
            installed: false,
        },
        {
            name: "Local Network Explorer",
            image: "devex",
            installed: false,
            tarbal:
                "https://storage.googleapis.com/staging.personal-website-fc11b.appspot.com/test.tar.gz",
        },
    ];
    return res.json(images);
});

app.post('/image/build', (req, res) => {
    const name = req.body.image;
    const file = `./images/${name}.tar.gz`;
    const labels = req.body.labels;

    docker.image.build(file, {
        t: name,
        pull: name,
        nocache: true,
        rm: true,
        labels
    })
        .then(stream => new Promise((resolve, reject) => {
            stream.on('data', data => console.log(data.toString()))
            stream.on('end', async () => {
                const im = await docker.image.get(name).status();
                const container = await startContainer(im.data.ContainerConfig.Labels);

                console.log(container);
                res.json(container);
            });
            stream.on('error', error => res.json(error))
        }))
        .then(async image => {
            const container = await startContainer(image);
            res.json(container);
        })
        .catch(error => console.log(error));
});


const io = require('socket.io')(http);


io.on('connection', socket => {
    console.log('a user connectec');

    const promisifyStream = stream => new Promise((resolve, reject) => {
        stream.on('data', data => io.emit('logs', data.toString()))
        stream.on('end', resolve)
        stream.on('error', reject)
    });

    socket.on('container-logs', async (id) => {
        console.log('Get container logs: ' + id);

        const container = docker.container.get(id);

        const status = await container.status();

        const since = Math.round(new Date(status.data.State.StartedAt).getTime() / 1000);

        container.logs({
            follow: true,
            stdout: true,
            tail: 100,
            since: since
        }).then(stream => promisifyStream(stream))
            .catch(error => console.log(error));
    });
});

http.listen(port, () => {
    console.log(`Server listening on ${port}`);
});