module.exports = {
  apps: [{
    name:         'office',
    script:       'server.js',
    instances:    1,
    exec_mode:    'fork',
    wait_ready:   true,       // wait for process.send('ready') before killing old
    listen_timeout: 5000,
    kill_timeout:   5000,
    restart_delay:  1000,
    watch:          false,
    env: {
      NODE_ENV: 'production',
      PORT:     8080,
    },
  }],
};
