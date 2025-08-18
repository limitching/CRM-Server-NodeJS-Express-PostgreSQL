'use strict';

import { server } from './app/index.js';

(function start() {
  server.start().catch(error => console.error(error));
})();

