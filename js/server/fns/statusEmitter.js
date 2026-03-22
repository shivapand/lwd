'use strict';

import EventEmitter from 'events';

class StatusEmitter extends EventEmitter {}

const statusEmitter = new StatusEmitter();

/**
 * Broadcasts a status update for a specific title.
 * @param {string} title - The movie title being processed.
 * @param {string} message - The status message to display.
 */
export const broadcastStatus = (title, message) => {
  statusEmitter.emit('statusUpdate', { title, message });
};

export default statusEmitter;
