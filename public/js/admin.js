/* 删除数据的操作 */
$(() => {
    $(".del").click(function(e) {
        let target = $(e.target);
        let id = target.data("id");
        let tr = $(".item-id-" + id);

        $.ajax({
            type: "DELETE",
            url: "/admin/movie/list?id=" + id
        }).done(function(res) {
            if (res.success === 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        })
    })

    // 对豆瓣的接口进行jsonp请求
    $('#douban').blur(function() {
        const douban = $(this)
        const movieId = douban.val()
        if (movieId) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + movieId,
                cache: true,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function(data) {
                    $('#inputTitle').val(data.title)
                    $('#inputDirector').val(data.directors[0].name)
                    $('#inputCountry').val(data.countries[0])
                    $('#inputPoster').val(data.images.large)
                    $('#inputYear').val(data.year)
                    $('#inputSummary').val(data.summary)
                }
            })
        }

    })
})