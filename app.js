const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(express.json());

// ============================================================
// CONEXÃO COM O MYSQL
// ============================================================
const conexao = mysql.createConnection({
  host: '127.0.0.1',
  port: 3302,        
  user: 'root',
  password: 'aluno',   
  database: 'aula_crud'
});

conexao.connect((erro) => {
  if (erro) {
    console.log('Erro ao conectar com o banco:', erro);
    return;
  }
  console.log('Conectado ao MySQL');
});

// ============================================================
// READ - LISTAR PRODUTOS
// ============================================================
app.get('/produtos', (req, res)=>{
  const sql = 'CALL sp_listar_produtos()'

  conexao.query(sql, (erro, resultados)=>{
    if(erro){
      console.log('Erro real do banco (GET):', erro.sqlMessage);
      return res.status(500).json({
        erro: 'erro ao buscar produtos'
      });
    }

    res.status(200).json(resultados[0])
  }) 
})

// ============================================================
// CREATE - CADASTRAR PRODUTO
// ============================================================
app.post('/produtos', (req, res)=>{
  const { nome, preco } = req.body;
  const sql = 'CALL sp_cadastrar_produto(?, ?)'

  conexao.query(
    sql, 
    [nome, preco],
    (erro, resultados)=>{
      if(erro){
        console.log('Erro real do banco (POST):', erro.sqlMessage);
        
        // CORRIGIDO AQUI: era express.status, agora é res.status
        return res.status(500).json({
          erro: 'Erro ao cadastrar produto'
        })
      }

      const id = resultados[0][0].id;

      res.status(201).json({
        mensagem: 'Produto cadastrado com sucesso',
        produto: {
          id,
          nome,
          preco
        }
      })
    }
  )
});

// ============================================================
// UPDATE - ATUALIZAR PRODUTO
// ============================================================
app.put('/produtos/:id', (req, res)=>{
  const id = req.params.id;
  const { nome, preco } = req.body

  const sql = 'CALL sp_atualizar_produto(?, ?, ?)'

  conexao.query(
    sql, 
    [id, nome, preco],
    (erro, resultados)=>{
      if(erro){
        console.log('Erro real do banco (PUT):', erro.sqlMessage);
        return res.status(500).json({
          erro: 'Erro ao atualizar produto'
        })
      }

      const linhasAfetadas = resultados[0][0].linhasAfetadas
      
      if(linhasAfetadas === 0){
        return res.status(404).json({
          erro: 'Produto não encontrado'
        });
      }

      res.status(200).json({
        mensagem: 'Produto atualizado com sucesso',
        produto: {
          id,
          nome,
          preco
        }
      })
    }
  )
})

// ============================================================
// DELETE - EXCLUIR PRODUTO
// ============================================================
app.delete('/produtos/:id', (req, res)=>{
  const id = req.params.id;
  const sql = 'CALL sp_excluir_produto(?)'

  conexao.query(
    sql,
    [id],
    (erro, resultados)=>{
      if(erro){
        console.log('Erro real do banco (DELETE):', erro.sqlMessage);
        return res.status(500).json({
          erro: 'Erro ao excluir produto'
        })
      }

      const linhasAfetadas = resultados[0][0].linhasAfetadas;

      if(linhasAfetadas === 0){
        return res.status(404).json({
          erro: 'Produto não encontrado'
        });
      }

      res.status(200).json({
        mensagem: 'Produto excluído com sucesso'
      })      
    }
  )
})

// ============================================================
// SERVIDOR
// ============================================================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});