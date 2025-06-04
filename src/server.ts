import App from './app';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const application = new App(port);

application.listen();
