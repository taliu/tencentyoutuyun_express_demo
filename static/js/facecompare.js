$(function () {
    var loading = false;
    $('#msg').hide();
    $('#btn').on('click', function () {
        if (loading) {
            return;
        }
        $('#result').text('');
        loading = true;
        $('#msg').show();
        let query = { imgA: $('#imgUrlA').val(), imgB: $('#imgUrlB').val() };
        $.getJSON('/facecompare', query, function (data) {
            loading = false;
            $('#msg').hide();
            if(data.similarity==undefined){
                alert('脸很特别,无法比较');
                return;
            }
            let same = data.similarity > 50 ? "是同一个人" : "不同一个人";
            $('#result').text('相似度:' + data.similarity.toFixed(1) + '%,' + same);
        });

    });
    $('#imgUrlA,#imgUrlB').on('change', function () {
        let data = { imgA: $('#imgUrlA').val(), imgB: $('#imgUrlB').val() };
        $('#faceImgA').attr('src', data.imgA);
        $('#faceImgB').attr('src', data.imgB);
    });
    $('#fileuploadA').fileupload({
        url: '/upload',
        dataType: 'json',
        done: function (e, data) {
            if (data.result && data.result.url) {
                $('#imgUrlA').val(data.result.url);
                $('#faceImgA').attr('src', data.result.url)
            } else {
                alert('上传失败!');
            }
        }
    })

    $('#fileuploadB').fileupload({
        url: '/upload',
        dataType: 'json',
        done: function (e, data) {
            if (data.result && data.result.url) {
                $('#imgUrlB').val(data.result.url);
                $('#faceImgB').attr('src', data.result.url)
            } else {
                alert('上传失败!');
            }
        }
    });

});