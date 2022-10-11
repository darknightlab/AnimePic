const md = markdownit();
$("#upload-select").click(function (e) {
    $("#upload-image").click();
});

$("#upload-image").change(function (e) {
    $("#upload-filename").text($("#upload-image")[0].files[0].name);
});

$("#upload-submit").click(function (e) {
    if ($("#upload-image")[0].files[0] == undefined) {
        log("还没选择要上传的文件!");
        return;
    }
    upload($("#upload-image")[0].files[0]);
});

function upload(file) {
    log("开始上传文件");
    let formData = new FormData();
    formData.append("img", file);
    $.ajax({
        url: "/animepic/upload",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            $("[mdtarget]").text(JSON.stringify(result));
            let imgblob = URL.createObjectURL(file);
            $("#image").attr("src", imgblob);
            $("#system-tags .mdui-panel-item-body .mdui-list").empty();
            $("#character-tags .mdui-panel-item-body .mdui-list").empty();
            $("#general-tags .mdui-panel-item-body .mdui-list").empty();
            Object.keys(result.system).forEach((tag) => {
                $("#system-tags .mdui-panel-item-body .mdui-list").append(genTag(tag, result.system[tag]));
            });
            Object.keys(result.character).forEach((tag) => {
                $("#character-tags .mdui-panel-item-body .mdui-list").append(genTag(tag, result.character[tag]));
            });
            Object.keys(result.general).forEach((tag) => {
                $("#general-tags .mdui-panel-item-body .mdui-list").append(genTag(tag, result.general[tag]));
            });
            $("#introduce-content").addClass("mdui-hidden");
            $("#tags-content").removeClass("mdui-hidden");
            $("#image-area").removeClass("mdui-hidden");
            $("#image-title").text(file.name);
            console.log((Object.keys(result.character).join() + "," + Object.keys(result.general).join()).replaceAll("_", " "));
        },
        error: function (e) {
            log("上传失败");
        },
    });
}

function genTag(tag, score) {
    let t = $(`
        <li class="mdui-list-item mdui-ripple">
        <div class="mdui-col-xs-9 mdui-col-sm-6"><a href=""></a></div>
        <div class="mdui-col-xs-3 mdui-col-sm-6"></div>
        </li>
    `);
    let a = t.children()[0].children[0];
    a.textContent = tag.replaceAll("_", " ");
    a.setAttribute("href", `https://danbooru.donmai.us/wiki_pages/show_or_new?title=${tag}`);
    a.setAttribute("target", "_blank");
    t.children()[1].textContent = score.toFixed(4);
    return t;
}

function loadMarkdown() {
    $("[mdtarget]").each(function () {
        let e = $(this);
        if (e.attr("mdsource") != undefined) {
            $.get(e.attr("mdsource"), function (result) {
                $(e.attr("mdtarget"))
                    .empty()
                    .append($(md.render(result)));
            });
        } else {
            $(e.attr("mdtarget"))
                .empty()
                .append($(md.render(e.text())));
        }
    });
}

function log(str) {
    let logEle = $("#log");
    let p = $("<p>" + str + "</p>");
    logEle.append(p);
    let logParent = logEle.parent();
    logParent.scrollTop(logParent[0].scrollHeight);
    // logEle.val(logEle.val() + str + "\n");
}

loadMarkdown();
