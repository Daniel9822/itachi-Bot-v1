import { connect } from "./connection.js";
import { load } from "./load.js";

const start = async () => {
  const socket = await connect();

  load(socket);
};

start();
