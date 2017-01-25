(function(){
    if (!lightning.modules) {
        lightning.modules = {};
    }
    var self = lightning.modules.speedTest = {
        maxPingCount: 10,
        uploadDataSize: 4, // In MB
        downloadDataSize: 10, // In MB
        section: null,
        pingCount: 0,
        container: null,
        pingTimes: 0,
        uploadData: false,
        results: null,
        run: function() {
            self.container = $('#speed-test-results');
            self.container.html('');
            self.pingCount = 0;
            self.section = 'ping';
            self.pingTimes = 0;
            self.results = {
                ping: [],
                avg_ping: null,
                upload: {},
                download: {},
            };
            self.next();
        },

        message: function(message) {
            self.container.append('<div>' + message + '</div>');
        },

        next: function() {
            switch (self.section) {
                case 'ping':
                    if (self.pingCount < self.maxPingCount) {
                        setTimeout(function(){
                            self.startTime = new Date();
                            $.ajax({
                                url: '/api/speed-test',
                                data: {
                                    action: 'ping',
                                },
                                dataType: 'JSON',
                                success: function(data) {
                                    var elapsed = new Date() - self.startTime - data.time;
                                    self.pingTimes += elapsed;
                                    self.pingCount++;
                                    self.results.ping.push(elapsed);
                                    self.message('Ping: ' + elapsed + 'ms');
                                    self.next();
                                }
                            });
                        }, 1000);
                    } else {
                        self.results.avg_ping = (self.pingTimes / self.pingCount).toFixed(1);
                        self.message('Average Ping: ' + self.results.avg_ping + 'ms');
                        self.section = 'upload';
                        self.next();
                    }
                    break;
                case 'upload':
                    if (!self.uploadData) {
                        // Create 1kb
                        self.uploadData = 'x'.repeat(1024);
                        // Create 1MB
                        self.uploadData = self.uploadData.repeat(1024);
                        // Create X MB.
                        self.uploadData = self.uploadData.repeat(self.uploadDataSize);
                    }
                    self.startTime = new Date();
                    $.ajax({
                        url: '/api/speed-test',
                        method: 'POST',
                        data: {
                            action: 'upload',
                            data: self.uploadData,
                        },
                        dataType: 'JSON',
                        success: function(data) {
                            var elapsed = new Date() - self.startTime - data.time;
                            self.results.upload.size = self.uploadDataSize + 'MB';
                            self.results.upload.time = (elapsed / 1000).toFixed(2) + 's';
                            self.results.upload.speed = (self.uploadDataSize * 1024/(elapsed / 1000)).toFixed(2) + 'kb/sec';

                            self.message('Uploaded ' + self.uploadDataSize + ' MB: ' + (elapsed / 1000).toFixed(2) + 's');
                            self.message('Average upload speed: ' + (self.uploadDataSize * 1024/(elapsed / 1000)).toFixed(2) + 'kb/sec');
                            self.section = 'download';
                            self.next();
                        }
                    });
                    break;
                case 'download':
                    self.startTime = new Date();
                    var xhr = $.ajax({
                        url: '/api/speed-test',
                        data: {
                            action: 'download',
                            size: self.downloadDataSize,
                        },
                        dataType: 'text',
                        success: function(data) {
                            var elapsed = new Date() - self.startTime;
                            self.results.download.size = self.downloadDataSize + 'MB';
                            self.results.download.time = (elapsed / 1000).toFixed(2) + 's';
                            self.results.download.speed = (self.downloadDataSize * 1024/(elapsed / 1000)).toFixed(2) + 'kb/sec';

                            self.message('Downloaded ' + self.downloadDataSize + ' MB: ' + self.results.download.time);
                            self.message('Average download speed: ' + self.results.download.speed);
                            self.section = 'report';
                            self.next();
                        }
                    });
                    break;
                case 'report':
                    $.ajax({
                        url: '/api/speed-test',
                        data: {
                            action: 'report',
                            report: self.results
                        },
                        type: 'POST',
                        success: function() {
                            self.message('COMPLETE!');
                        }
                    });
            }
        }
    };
})();
