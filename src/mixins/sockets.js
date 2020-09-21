import io from "socket.io-client";

export default {
  methods: {
    parseStream(msg) {
      msg = JSON.parse(msg);
      if (msg.stream) {
        // eslint-disable-next-line no-control-regex
        const str = msg.stream.replace(/\0|\1|\u0019/g, "");
        return str;
      }
      return msg;
    },
    openLogsSocket(cId) {
      console.log(`Started logs socket for ${cId}`);
      const socket = io("http://localhost:3939");

      socket.on("connect", () => {
        socket.emit("container-logs", cId);
      });

      socket.on(cId, (msg) => {
        const parsedStream = this.parseStream(msg);
        this.logs.push(parsedStream);
      });
    },
    installImage(imageData) {
      return new Promise((resolve) => {
        console.log(`Started socket to install ${imageData.name}`);

        const socket = io("http://localhost:3939", { forceNew: true });

        socket.on("connect", () => {
          socket.emit("build-image", imageData);
        });

        socket.on("install-logs", (msg) => {
          const parsedStream = this.parseStream(msg);
          this.logs.push(parsedStream);

          if (parsedStream.success === true) {
            resolve({ success: true });
          }
        });
      });
    },
    removeContainerAndImage({ container, image }) {
      return new Promise((resolve) => {
        console.log(`Started socket to uninstall ${container}`);

        const socket = io("http://localhost:3939", { forceNew: true });

        socket.on("connect", () => {
          console.log("Socket connected.");
          socket.emit("remove-image", { container, image });
        });

        socket.on("uninstall-logs", (msg) => {
          const parsedStream = this.parseStream(msg);
          this.logs.push(parsedStream);

          if (parsedStream.success === true) {
            resolve({ success: true });
          }
        });
      });
    },
  },
};
