

var app = {
    ws: null,
    connect: function(wsurl){
        var self = this;
        this.ws = new WebSocket(wsurl);
        this.ws.onopen = function(e){
            console.log("Connection established!");
            $('#mocksection').hide();
            $('#requestsection').show();
            toastr.success('WS Mock server connected!');
        };
        
        this.ws.onclose = function(e){
            console.log("Connection closed!");
            $('#mocksection').show();
            $('#requestsection').hide();
            toastr.error('WS Mock server disconnected');
        };
        
        this.ws.onerror = function(e){
            console.log("Connection error!");
            $('#mocksection').show();
            $('#requestsection').hide();
            toastr.error('WS Mock server error');
        };        

        this.ws.onmessage = function(m){
            var msg = JSON.parse(m.data);
            self.logLine('Message type received: ' + msg.type);
            switch (msg.type){
                case 'error':
                    toastr.error(msg.data);
                    self.logData(msg.data.details);
                    break;
                case 'mo_reply':
                    toastr.success('MO reply success');
                    self.logData(msg.data);
                    break;
                case 'mt':
                    toastr.success('MT success');
                    $('#responseSMS').append('<p>' + self.nl2br(self.escapeHtml(msg.data.text)) + '<span class="badge">' + msg.data.price + '</span></p><hr>');
                    self.logData(msg.data);
                    break;                    
            }                        
            self.logLine('===================');
        };      
    },
    sendMessage: function (type, data){
        var message = JSON.stringify({
            'type': type,
            'data': data
        });
        this.ws.send(message);
    },
    
    init: function(){
        var self = this;
        $('#connectBtn').click(function(){
            self.connect($('#wsurl').val());
        });
        
        $('#sendBtn').click(function(){
            self.sendMessage('mo', {
                'short_id': $('#short_id').val(),
                'from': $('#from').val(),
                'text': $('#text').val(),
                'url': $('#url').val(),
                'provider': $('#provider').val(),
                'language': $('#language').val(),
            });
        }); 
        $('#clearBtn').click(function(){
            $('#responseSMS').html("");
        });               
    },
    nl2br: function(text){
        return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    },
    logLine: function(line){
        console.log(line);
        $('#log').val($('#log').val() + "\n" + line);
        var textarea = document.getElementById('log');
        textarea.scrollTop = textarea.scrollHeight;
    },
    logData: function(data){
        console.log(data);
        var self = this;
        for(var key in data){
            self.logLine(key + ": " + data[key]);
        };        
    },
    escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }    
};
        


