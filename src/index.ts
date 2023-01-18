import { main } from "./main"
import Client = require("ssh2-sftp-client")
main(new Client()) // we need to call main from a separate file so that side-effects don't occur during tests