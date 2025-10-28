import { connect } from "./connection.js";
import { load } from "./load.js";
// import { downloadYt } from "./services/downloadYt.js";

const start = async () => {
  const socket = await connect();

  load(socket);

  // await downloadYt()
};

start();
