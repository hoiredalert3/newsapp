tinymce.init({
    selector: 'div.article-content#content',
    min_height: 500,    // 9 lines
    max_height: 5000,   // 90 lines
    menubar: true,
    plugins: [
        'advlist', 'autolink', 'autoresize', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime', 'media', 'nonbreaking',
        'table', 'emoticons', 'template', 'help',
        // unavailable: 'hr', 'print', 'paste'
    ],
    toolbar: 'undo redo | formatselect | ' +
        'fontsize bold italic underline backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
    images_upload_handler: uploadImage
});