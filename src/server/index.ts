import { Game } from './Game/Game';
import { SocketServer } from './Network/SocketServer';

const game = new Game();
const app = new SocketServer();

export {app};