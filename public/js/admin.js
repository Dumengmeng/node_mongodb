/* 删除数据的操作 */
$(() => {
    $(".del").click(function(e) {
        let target = $(e.target);
        let id = target.data("id");
        let tr = $(".item-id-" + id);

        $.ajax({
            type: "DELETE",
            url: "/admin/list?id=" + id
        }).done(function(res) {
            if (res.success === 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        })
    })
})