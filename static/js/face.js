$(function () {
    var loading = false;
    $('#msg').hide();
    $('#btn').on('click', function () {
        if (loading) {
            return;
        }
        var imgSrc = $('#imgUrl').val();
        $('img').attr('src', imgSrc);
        $('.box,.msg').remove();
        loading = true;
        $('#msg').show();
        $.getJSON('/face', { img: imgSrc }, function (faces) {
            faces.forEach(function (f) {
                createFaceBox(f);
            });
            loading = false;
            $('#msg').hide();
        })
    });
    $('#btn').click();

    $('#fileupload').fileupload({
        url: '/upload',
        dataType: 'json',
        done: function (e, data) {
            if (data.result && data.result.url) {
                $('#imgUrl').val(data.result.url);
                $('#btn').click();
            } else {
                alert('上传失败!');
            }
        }
    })

});

function createFaceBox(face) {
    var $box = $('<div class="box">')
    var offset = $('#faceImg').offset();
    $box.css({
        left: face.x + offset.left,
        top: face.y + offset.top,
        height: face.height,
        width: face.width
    });
    $('body').append($box);
    var $msg = $('<div class="msg">')
    $msg.text(getDescription(face));
    $msg.css({
        left: face.x + offset.left,
        top: face.y + offset.top + face.height + 2
    });
    $('body').append($msg);
}

function getDescription(face) {
    var sex = face.gender >= 50 ? '男' : '女';
    var glass = face.glass ? "眼镜" : "";
    return [face.age + '岁', smile(face.expression), glass, sex].join(' ');
}

function smile(val) {
    if (val <= 25) {
        return '';
    } else if (val <= 50) {
        return '微笑';
    } else {
        return '大笑';
    }
}
