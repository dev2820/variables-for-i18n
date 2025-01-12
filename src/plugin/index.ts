function showPluginUI() {
  figma.showUI(__html__);
}

function setup() {
  figma.ui.onmessage = (msg) => {
    // handle msg
  };
}

function main() {
  setup();
  showPluginUI();
}

main();
