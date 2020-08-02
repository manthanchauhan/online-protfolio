function getCookie(name) {
    var cookieValue = null;

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function () {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            var csrftoken = getCookie('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });

    $("#titleName").keyup(function (e) { check_charcount("titleName", 40, e); });
    $("#titleTagline").keyup(function (e) { check_charcount("titleTagline", 55, e); });

});

function UploadProjectImage(username, sno) {
    var image = document.getElementById("project_picture" + sno).files;

    if (!image.length) {
        return alert("Upload an image first");
    }

    image = image[0];
    var filename = image.name;
    console.log(filename);

    var upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: mediaPath + "/projectImages",
            Key: username + "_projectImage_" + sno + "." + filename.split('.').pop(),
            Body: image,
            ACL: "public-read"
        }
    });

    var promise = upload.promise();

    promise.then(function (data) {
        url = "https://" + albumBucketName + ".s3." + bucketRegion + ".amazonaws.com/media/projectImages/" + username + "_projectImage_" + sno + "." + filename.split('.').pop();
        $("#project_thumb" + sno).attr("src", url);
    },
        function (err) {
            return alert("There was an error uploading your photo: ", err.message);
        });
};

function UploadProfilePic(username) {
    // console.log("hi");
    var image = document.getElementById("profile_picture").files;

    if (!image.length) {
        return alert("Upload an image first");
    }

    var picture = image[0];
    var filename = picture.name;

    // console.log(filename);

    var upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: mediaPath,
            Key: username + "_profile_pic." + filename.split('.').pop(),
            Body: picture,
            ACL: "public-read"
        }
    });

    var promise = upload.promise();

    promise.then(
        function (data) {
            console.log(data);
            url = "https://" + albumBucketName + ".s3." + bucketRegion + ".amazonaws.com/media/" + username + "_profile_pic." + filename.split('.').pop();
            $("#profile_pic_alt").attr("src", url);
            updateAboutData(null, null, url, null);
        },
        function (err) {
            return alert("There was an error uploading your photo: " + err.message);
        }
    );
};

$("#profile_pic_alt").on("click", function () {
    $("#profile_picture").click();
});

function uploadProjImage(sno) {
    // console.log(sno);
    $("#project_picture" + sno).click();
};

function save_project(project) {
    id = project.attr("proj_id");
    title = $("#proj_title" + id).text();
    description = $("#proj_desc" + id).summernote('code');
    skills = $("#proj_skills" + id).text();
    image = $("#project_thumb" + id).attr("src");
    // console.log(description);

    data = {
        'id': id,
        'title': title,
        'description': description,
        'skills': skills,
        'image': image
    };

    console.log(data);

    $.ajax({
        url: '/portfolio/edit_projects/',
        type: 'POST',
        data: data,
        dataType: "json",
        complete: function (response) {
            alert(response.responseJSON.message);
        }
    });
};

function delete_project(project) {
    id = project.attr("proj_id");

    if (!confirm('Do you want to delete the project?')) {
        return false;
    }

    project = $("#proj" + id).hide();

    $.ajax({
        url: '/portfolio/delete_project/',
        type: 'POST',
        data: {
            'id': id,
        },
        dataType: "json",
        complete: function (response) {
            alert(response.responseJSON.message);
        }
    });
    //console.log("hidden");
}

function addProject(avatar) {
    // console.log("hi");

    $.ajax({
        url: '/portfolio/add_project/',
        type: 'POST',
        data: {},
        dataType: "json",
        error: function (response) {
            alert(response.responseJSON.message);
            return false;
        },
        success: function (response) {
            // console.log(response);
            // console.log(response.responseJSON);
            // console.log(response.project_data);
            project = response.project_data;

            var element = `<div class="modal" tabindex="-1" role="dialog" id="projectLinks` + project.serial_no + `">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Project Links</h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <form>
                <div class="form-group" style="text-align:left;">
                  <label for="projLiveLink` + project.serial_no + `">Live Project Link:</label>
                  <input type="text" class="form-control" id="projLiveLink` + project.serial_no + `">
                </div>

                <div class="form-group" style="text-align:left;">
                  <label for="projCodeLink` + project.serial_no + `">GitHub (VCS) Link:</label>
                  <input type="text" class="form-control" id="projCodeLink` + project.serial_no + `"
                  placeholder="https://github.com/manthanchauhan/online-portfolio">
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-success" onclick="saveProjLinks('` + project.serial_no + `')">Save</button>
            </div>
          </div>
        </div>
      </div>



      <div class="container project" id="proj` + project.serial_no + `">
          <div class="card bg-dark project_card" proj_id="` + project.serial_no + `">
            <div class="card-header project_title" style="color:white;">
              <span class="float-left" id="proj_title-1" contenteditable="true">` + project.title + `</span>
            </div>

            <div class="card-body project_body">
              <div class="project_desc float-left col-lg-7" id="proj_desc` + project.serial_no + `" style="text-align:left;color:white;" contenteditable="true">` + project.description + `</div>
              <div class="project_images float-right col-lg-5" style="text-align:center;">
                <img class="img-fluid img-thumbnail project_image" id="project_thumb` + project.serial_no + `" onclick="uploadProjImage('` + project.serial_no + `')" src="` + project.image + `" alt="">
                <input type="file" id="project_picture` + project.serial_no + `" style="display:none;" onchange="UploadProjectImage('{{request.user.username}}', '` + project.serial_no + `');">
              </div>
            </div>

            <div class="card-footer project-footer" style="color:white; text-align:left;">
              <div class="container col-lg-7 float-left" style="padding:0px;">
                <strong>Skills Used: </strong>
                <span id="proj_skills` + project.serial_no + `" contenteditable="true">` + project.skills + `</span>
              </div>

              <div class="project_links col-lg-5 float-right" style="text-align:right;">
                  <button class="btn btn-success" proj_id="` + project.serial_no + `" onclick="save_project($(this));" type="button" name="button">Save</button>
                  <button class="btn btn-primary" data-toggle="modal" data-target="#projectLinks` + project.serial_no + `" type="button" name="button">Live Project</button>
                  <button class="btn btn-light" data-toggle="modal" data-target="#projectLinks` + project.serial_no + `" type="button" name="button">Code</button>
                  <button class="btn btn-danger" proj_id="` + project.serial_no + `" onclick="delete_project($(this));" type="button" name="button">Delete</button>
              </div>
            </div>
          </div>

      </div>`;
            $("#projectList").append(element);
            $("#addProjectButton").attr("disabled", true);

        }
    });


}

function saveProjLinks(sno) {
    liveLink = $("#projLiveLink" + sno).val();
    codeLink = $("#projCodeLink" + sno).val();

    $.ajax({
        url: '/portfolio/edit_projects/',
        type: 'POST',
        data: {
            'id': sno,
            'liveLink': liveLink,
            'codeLink': codeLink,
        },
        dataType: "json",
        complete: function (response) {
            alert(response.responseJSON.message);
        }
    });

    $('#projectLinks' + sno).modal('toggle');
    // console.log(liveLink);
};

function exportPortfolio() {
    if (!confirm("Do you want to export your new portfolio?")) {
        return false;
    }

    $.ajax({
        url: '/portfolio/export_portfolio/',
        type: 'POST',
        data: {},
        dataType: "json",
        success: function (response) {
            // console.log(response.url);
            // console.log(response);
            $("#portLink").attr("value", response.url);
            $("#portLink2").attr("href", response.url);
            $("#portfolioLink").show();
        },
        error: function (response) {
            alert(response, response.responseJSON.message);
        }
    });
};

function closePortLink() {
    $("#portfolioLink").hide();
}

function toSummernote(element, type) {
    let content = $(element).innerHTML;

    if (type === "aboutOrange") {
        $(element).summernote({
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
            ],
            code: content,
        });
    }

    else if (type === 'projectDesc') {
        $(element).summernote({
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']]
            ],
            code: content,
        });
    }

    // $(element).summernote('code', content);

}

function updateTagline() {
    let tag_line = document.getElementById("titleTagline").innerText;
    let len = tag_line.length;
    let max = 55;

    if (len > max) {
        return;
    }

    $("#titleTaglineCharCount").hide();
    updateAboutData(null, tag_line, null, null);
}

function updateName() {
    let new_name = document.getElementById("titleName").innerText;
    let len = new_name.length;
    let max = 40;

    if (len > max) {
        return;
    }

    $("#titleNameCharCount").hide();

    updateAboutData(new_name, null, null, null);
};

function showErrorModal(data, reason) {
    $("#errorModal").show();
    $("#errorModal").find(".modal-title").text(reason);

    let html = '';
    for (let key in data) {
        html = html + `<h7>Field '` + key + `' has the following error(s):</h7>`;
        html = html + `<ul>`;

        for (let n = 0; n < data[key].length; n++) {
            html = html + `<li>` + data[key][n] + `</li>`;
        }

        html = html + `</ul><br>`;
    }

    $("#errorModal").find(".modal-body").html(html);
}

function closeErrorModal() {
    $("#errorModal").hide();
}

function updateAboutData(name, tag_line, profile_pic, about) {
    let data = { "name": name, "tag_line": tag_line, "profile_pic": profile_pic, "about": about }

    $.ajax({
        url: '/portfolio/update_about/',
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (data, textStatus, response) {
            // alert(response.statusText);
        },
        error: function (data) {
            showErrorModal(data.responseJSON, data.statusText);
        }
    });
}

function check_charcount(content_id, max, e) {
    let len;

    if (content_id == "aboutOrange") {
        len = $("#aboutDiv").find(".note-editable").text().length;
        $('#' + content_id + "CharCount").css("font-size", "1.5rem");
    }
    else if (content_id != "aboutOrange") {
        len = $('#' + content_id).text().length;
        $('#' + content_id + "CharCount").css("font-size", "1rem");
    }

    $("#" + content_id + "CharCount").text(len + "/" + max);
    $("#" + content_id + "CharCount").css("color", "green");

    if (len > max) {
        $('#' + content_id + "CharCount").css("color", "red");

        if (content_id == "aboutOrange") {
            $('#' + content_id + "CharCount").css("font-size", "1.7rem");
        }
        else if (content_id != "aboutOrange") {
            $('#' + content_id + "CharCount").css("font-size", "1.5rem");
        }
    }
}

function showCharCount(element, max) {
    let len = $(element).text().length;
    $("#" + element.id + "CharCount").show();
    $("#" + element.id + "CharCount").text(len + "/" + max);
}

function aboutOrangeFocusIn(element, max) {
    let content = $(element).innerHTML;

    $(element).summernote({
        codemirror: { "theme": "ambiance" },
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Open Sans'],
        toolbar: [
            ['fontsize', ['fontsize']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']]
        ],
        code: content,
    });

    $("#aboutDiv").find(".note-editable").css({
        "opacity": "86%",
        "font-family": "'Open Sans', sans-serif",
        "width": "90%",
        "min-height": "450px",
        "color": "black",
        "padding": "30px 5% 50px 15%",
        "border-radius": "0 25px 25px 0",
        "background": "#ececec",
        "font-size": "1.6rem",
    });

    $("#aboutDiv").find(".note-toolbar").css({
        "text-align": "center",
    });

    $("#aboutDiv").find(".note-toolbar").find(".note-btn").css({
        "background": "#ff8080",
    });

    $("#aboutDiv").find(".note-editable").keyup(function (e) { check_charcount("aboutOrange", 500, e); });

    $("#aboutDiv").find(".note-editor").focusout(function () {
        updateAbout();
    });

    showCharCount(element, max);
}

function updateAbout() {
    let aboutHtml = $("#aboutOrange").summernote('code');
    let max = 2000;
    console.log(aboutHtml.length);

    if (aboutHtml.length >= max) {
        return;
    }

    updateAboutData(null, null, null, aboutHtml);
}


$('#carouselExampleControls').on('slid.bs.carousel', function () {
    $(".skillCell").each(function () {
        let element = $(this);
        resize_skill_names(element);
    });
})

function resize_skill_names(element) {
    let child = element.find(".skillName").first();

    if ((child.height() > element.height()) || (child.width() > element.width())) {
        let fontsize = child.css("font-size");
        child.css("font-size", parseFloat(fontsize) - 1);
        resize_skill_names(element);
    }

    return;
}


