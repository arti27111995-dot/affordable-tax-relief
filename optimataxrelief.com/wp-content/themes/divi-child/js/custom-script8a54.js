// Add Accessibility Attributes to Buttons
document.addEventListener('DOMContentLoaded', function () {
    var anchors = document.querySelectorAll('.et_pb_button.et_pb_button_0_tb_header.lightbox-trigger-help.et_pb_bg_layout_light');
        anchors.forEach(function (anchor) {
            anchor.setAttribute('role', 'button');
            anchor.setAttribute('tabindex', '0');
        });
    });