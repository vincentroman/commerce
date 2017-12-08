import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';
App.getInstance().start();
