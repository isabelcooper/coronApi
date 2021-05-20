import {HootlePageHandler} from "./src/HootlePageHandler";
import {EnricherServer} from "./enricherServer";

const hootlePageHandler = new HootlePageHandler(new MetaInfoFinder());

new EnricherServer(hootlePageHandler);


