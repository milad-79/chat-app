import autoBind from 'auto-bind';

class Controller {
  constructor() {
    autoBind(this);
  }

  protected test() {
    console.log('test method for controller');
  }
}

export default Controller;
