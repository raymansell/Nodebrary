/* global FilePond FilePondPluginImagePreview  FilePondPluginImageResize FilePondPluginFileEncode */

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
});

// Turns all file input elements with a class of 'filepond' to pond inputs
FilePond.parse(document.body);
