class Transferer {
  constructor() {
    this.contentImg = document.querySelector("#contentImg img");
    this.styleImg = document.querySelector("#styleImg img");
    this.styledCanvas = document.querySelector("#styledCanvas canvas");

    this.generateArtButton = document.getElementById("generateArtButton");
    this.uploadButton = document.getElementById("upload");
    this.fileInput = document.getElementById("input");
    this.downloadButton = document.getElementById("download");

    this.neuralNet = new NeuralNet();
    this.init();
  }

  async init() {
    this.generateArtButton.addEventListener("click", this.updateStyle.bind(this));
    this.downloadButton.addEventListener("click", this.download.bind(this));
    this.uploadButton.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", this.upload.bind(this));
    window.addEventListener("resize", this.resize.bind(this));

    await this.loadImg(this.contentImg);
    this.resize();

    await this.neuralNet.init();
    this.applyStyle();
  }

  async updateStyle() {
    this.styleImg.src = "https://source.unsplash.com/random/256x256/?art&" + Math.random();
    await this.loadImg(this.styleImg);
    this.applyStyle();
  }

  async applyStyle() {
    try {
      const styledData = await this.neuralNet.applyStyle(this.contentImg, this.styleImg);
      tf.browser.toPixels(styledData, this.styledCanvas);
    } catch (e) {
      console.log(e);
      this.generateArtButton.innerText = "Error: try to reload";
    }
  }

  async upload(e) {
    if (e.target.files[0]) {
      this.contentImg.src = window.URL.createObjectURL(e.target.files[0]);
      await this.loadImg(this.contentImg);
      this.resize();
      this.applyStyle();
    }
  }

  download() {
    var a = document.createElement("a");
    a.href = this.styledCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    a.download = "styled.png";
    document.body.appendChild(a);
    a.click();
  }
  
  async loadImg(img) {
    return new Promise((res) => {
      img.onload = res;
      if (img.complete && img.naturalHeight !== 0) res();
    });
  }
}
