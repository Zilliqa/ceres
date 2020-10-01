#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var port = 3939;
app.use(bodyParser.json());
app.use(cors());
var http = require("http").createServer(app);
var Docker = require("node-docker-api").Docker;
var docker = new Docker({ socketPath: "/var/run/docker.sock" });
var registerInNetwork = function (containerData) { return __awaiter(_this, void 0, void 0, function () {
    var exists, network, cc, network, cc, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, docker.network.list({
                    filters: { name: ["ceresnetwork"] },
                })];
            case 1:
                exists = _a.sent();
                if (!(exists.length === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, docker.network.create({ name: "ceresnetwork" })];
            case 2:
                network = _a.sent();
                return [4 /*yield*/, network.connect(containerData)];
            case 3:
                cc = _a.sent();
                return [2 /*return*/, cc];
            case 4:
                network = docker.network.get(exists[0].data.Id);
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, network.connect(containerData)];
            case 6:
                cc = _a.sent();
                return [2 /*return*/, cc];
            case 7:
                error_1 = _a.sent();
                console.log("error", error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
app.get("/container/running", function (req, res) {
    docker.container
        .list({ filters: { label: ["ceres"] } })
        // Inspect
        .then(function (containers) {
        var list = containers.map(function (item) { return item.data; });
        res.json(list);
    })
        .catch(function (error) { return console.log(error); });
});
app.get("/container/list", function (req, res) {
    docker.container
        .list({ all: true, filters: { label: ["ceres"] } })
        // Inspect
        .then(function (containers) {
        var list = containers.map(function (item) { return item.data; });
        res.json(list);
    })
        .catch(function (error) { return console.log(error); });
});
var startContainer = function (image) { return __awaiter(_this, void 0, void 0, function () {
    var containers, exists, status_1, createOptions, container, status_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, docker.container.list({
                    all: true,
                    filters: { label: ["ceres"] },
                })];
            case 1:
                containers = _a.sent();
                exists = containers.find(function (item) { return item.data.Labels.ceres === image.ceres; });
                if (!(exists !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, exists.start()];
            case 2:
                _a.sent();
                return [4 /*yield*/, exists.status()];
            case 3:
                status_1 = _a.sent();
                return [2 /*return*/, status_1.data];
            case 4:
                createOptions = {
                    Image: image.ceres + ":latest",
                    name: image.ceres,
                    Labels: {
                        ceres: image.ceres,
                        containerPort: image.containerPort,
                        hostPort: image.hostPort,
                        name: image.name,
                    },
                    HostConfig: {
                        PortBindings: {},
                    },
                    ExposedPorts: {},
                };
                createOptions["HostConfig"]["PortBindings"][image.containerPort] = [
                    { HostPort: image.hostPort },
                ];
                createOptions["ExposedPorts"][image.containerPort] = {};
                return [4 /*yield*/, docker.container.create(createOptions)];
            case 5:
                container = _a.sent();
                return [4 /*yield*/, registerInNetwork({ Container: container.data.Id })];
            case 6:
                _a.sent();
                return [4 /*yield*/, container.start()];
            case 7:
                _a.sent();
                return [4 /*yield*/, container.status()];
            case 8:
                status_2 = _a.sent();
                return [2 /*return*/, status_2.data];
        }
    });
}); };
app.post("/container/start", function (req, res) {
    var image = req.body.image || undefined;
    docker.container
        .list({ all: true, filters: { label: ["ceres"] } })
        .then(function (containers) {
        var exists = containers.find(function (item) { return item.data.Labels.ceres === image; });
        if (exists !== undefined) {
            exists
                .start()
                .then(function (container) { return __awaiter(_this, void 0, void 0, function () {
                var status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, registerInNetwork({ Container: container.data.Id })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, container.status()];
                        case 2:
                            status = _a.sent();
                            res.json(status.data);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) { return res.json(error.json); });
        }
        else {
            res.end("Container not found. Please reinstall Service Image");
        }
    })
        .catch(function (error) { return res.json(error.json); });
});
app.post("/container/stop", function (req, res) {
    var id = req.body.id;
    var container = docker.container.get(id);
    container
        .stop()
        .then(function (response) { return res.json(response); })
        .catch(function (error) { return res.json(error.json); });
});
app.post("/container/status", function (req, res) {
    var id = req.body.id;
    try {
        var container = docker.container.get(id);
        container.status().then(function (status) {
            res.json(status.data);
        });
    }
    catch (error) {
        res.json(error);
    }
});
app.get("/image/list", function (req, res) {
    docker.image.list({ filters: { label: ["ceres"] } }).then(function (images) {
        res.json(images);
    });
});
app.get("/image/available", function (req, res) {
    var images = [
        {
            name: "Isolated Server Instance",
            image: "isolatedserver",
            tarbal: "isolatedserver.tar.gz",
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
            tarbal: "isolatedserverfaucet.tar.gz",
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
            tarbal: "https://storage.googleapis.com/staging.personal-website-fc11b.appspot.com/test.tar.gz",
        },
    ];
    return res.json(images);
});
app.post("/image/build", function (req, res) {
    var name = req.body.image;
    var file = "./images/" + name + ".tar.gz";
    var labels = req.body.labels;
    docker.image
        .build(file, {
        t: name,
        pull: name,
        nocache: true,
        rm: true,
        labels: labels,
    })
        .then(function (stream) {
        return new Promise(function (resolve, reject) {
            stream.on("data", function (data) { return console.log(data.toString()); });
            stream.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                var im, container;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, docker.image.get(name).status()];
                        case 1:
                            im = _a.sent();
                            return [4 /*yield*/, startContainer(im.data.ContainerConfig.Labels)];
                        case 2:
                            container = _a.sent();
                            console.log(container);
                            res.json(container);
                            return [2 /*return*/];
                    }
                });
            }); });
            stream.on("error", function (error) { return res.json(error); });
        });
    })
        .then(function (image) { return __awaiter(_this, void 0, void 0, function () {
        var container;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startContainer(image)];
                case 1:
                    container = _a.sent();
                    res.json(container);
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) { return console.log(error); });
});
var io = require("socket.io")(http);
io.on("connection", function (socket) {
    var promisifyStream = function (stream, channel) {
        return new Promise(function (resolve, reject) {
            stream.on("data", function (data) {
                return io.emit(channel, JSON.stringify({ stream: data.toString("UTF-8") }));
            });
            stream.on("end", resolve);
            stream.on("error", reject);
        });
    };
    socket.on("docker-ping", function () { return __awaiter(_this, void 0, void 0, function () {
        var ping, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, docker.ping()];
                case 1:
                    ping = _a.sent();
                    io.emit("docker-ping", { success: ping });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    io.emit("docker-ping", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    socket.on("container-logs", function (id) { return __awaiter(_this, void 0, void 0, function () {
        var container, status, since;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Get container logs: " + id);
                    container = docker.container.get(id);
                    return [4 /*yield*/, container.status()];
                case 1:
                    status = _a.sent();
                    since = Math.round(new Date(status.data.State.StartedAt).getTime() / 1000 - 100);
                    container
                        .logs({
                        follow: true,
                        stdout: true,
                        stderr: true,
                        tail: 100,
                        since: since,
                    })
                        .then(function (stream) { return promisifyStream(stream, id); })
                        .catch(function (error) { return promisifyStream(error, id); });
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("remove-image", function (_a) {
        var image = _a.image, container = _a.container;
        return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, docker.container
                                .get(container)
                                .delete({ force: true })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, docker.image.get(image).remove()];
                    case 2:
                        _b.sent();
                        io.emit("uninstall-logs", JSON.stringify({ success: true }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        io.emit("uninstall-logs", JSON.stringify({ success: false }));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
    socket.on("build-image", function (image) { return __awaiter(_this, void 0, void 0, function () {
        var name, file, labels;
        var _this = this;
        return __generator(this, function (_a) {
            name = image.image;
            file = "./images/" + name + ".tar.gz";
            labels = image.labels;
            console.log("Build image: " + image.image);
            docker.image
                .build(file, {
                t: name,
                pull: name,
                nocache: true,
                rm: true,
                labels: labels,
            })
                .then(function (stream) { return promisifyStream(stream, "install-logs"); })
                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                var createOptions, container;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createOptions = {
                                Image: image.image + ":latest",
                                name: image.image,
                                Labels: {
                                    ceres: image.image,
                                    containerPort: image.labels.containerPort,
                                    hostPort: image.labels.hostPort,
                                    name: image.labels.name,
                                },
                                HostConfig: {
                                    PortBindings: {},
                                },
                                ExposedPorts: {},
                            };
                            createOptions["HostConfig"]["PortBindings"][image.labels.containerPort] = [{ HostPort: image.labels.hostPort }];
                            createOptions["ExposedPorts"][image.labels.containerPort] = {};
                            return [4 /*yield*/, docker.container.create(createOptions)];
                        case 1:
                            container = _a.sent();
                            //await container.start();
                            return [4 /*yield*/, registerInNetwork({ Container: container.data.Id })];
                        case 2:
                            //await container.start();
                            _a.sent();
                            console.log("Container successfully generated " + container.data.Id);
                            io.emit("install-logs", JSON.stringify({
                                stream: "Container successfully generated " + container.data.Id,
                            }));
                            io.emit("install-logs", JSON.stringify({ success: true }));
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) { return console.log(error); });
            return [2 /*return*/];
        });
    }); });
});
http.listen(port, function () {
    console.log("Server listening on " + port);
});
//# sourceMappingURL=index.js.map