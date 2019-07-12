var socket = io.connect();

$('form#chat').submit(function (e) {
    e.preventDefault();

    const msg = $(this).find('#msgBox').val();
    if (msg) {
        socket.emit('send msg', msg, function () {
            $('form#chat #msgBox').val('') || '';
        });
    }
});

socket.on('own msg', function (msg) {
    const content = $('<p />')
        .addClass('text-left')
        .addClass('mx-3')
        .addClass('my-1')
        .css('font-size', '1.1rem')
        .html(msg);

    const innerDiv = $('<div />')
        .addClass('shadow-sm')
        .addClass('rounded')
        .addClass('bg-white')
        .addClass('w-auto')
        .append(content);

    const outerDiv = $('<div />')
        .addClass('d-flex')
        .addClass('flex-row-reverse')
        .addClass('my-3')
        .append(innerDiv);

    $('#messages').append(outerDiv);
});

socket.on('chatbot msg', function (msg) {
    const content = $('<p />')
        .addClass('text-left')
        .addClass('mx-3')
        .addClass('my-1')
        .css('font-size', '1.1rem')
        .html(msg);

    const innerDiv = $('<div />')
        .addClass('shadow-sm')
        .addClass('rounded')
        .addClass('bg-primary')
        .addClass('text-white')
        .addClass('w-auto')
        .append(content);

    const outerDiv = $('<div />')
        .addClass('d-flex')
        .addClass('my-3')
        .append(innerDiv);

    $('#messages').append(outerDiv);
});