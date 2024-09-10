export default class WindowSizeTracker {
  constructor() {
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  startTracking() {
    window.addEventListener('resize', this.handleResize);
  }

  stopTracking() {
    window.removeEventListener('resize', this.handleResize);
  }
}
