import express from "express";
import cors from 'cors';
import routes from './routes'
import path from "path";
import { errors } from 'celebrate';

const app = express();

app.use(cors()); //Adicionar uma URL para a aplicação
app.use(express.json());
app.use(routes);

//Acesso de arquivos estáticos(img)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);