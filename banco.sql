CREATE DATABASE IF NOT EXISTS aula_crud;

USE aula_crud;


-- ============================================================
-- TABELA PRODUTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);


-- ============================================================
-- REMOVE AS PROCEDURES CASO JÁ EXISTAM
-- ============================================================

DROP PROCEDURE IF EXISTS sp_listar_produtos;
DROP PROCEDURE IF EXISTS sp_cadastrar_produto;
DROP PROCEDURE IF EXISTS sp_atualizar_produto;
DROP PROCEDURE IF EXISTS sp_excluir_produto;


-- ============================================================
-- READ - LISTAR PRODUTOS
-- ============================================================

DELIMITER //

CREATE PROCEDURE sp_listar_produtos()
BEGIN

    SELECT
        id,
        nome,
        preco
    FROM produtos
    ORDER BY id;

END //

DELIMITER ;


-- ============================================================
-- CREATE - CADASTRAR PRODUTO
-- ============================================================

DELIMITER //

CREATE PROCEDURE sp_cadastrar_produto(
    IN p_nome VARCHAR(100),
    IN p_preco DECIMAL(10,2)
)
BEGIN

    INSERT INTO produtos (
        nome,
        preco
    )
    VALUES (
        p_nome,
        p_preco
    );

    SELECT
        LAST_INSERT_ID() AS id;

END //

DELIMITER ;


-- ============================================================
-- UPDATE - ATUALIZAR PRODUTO
-- ============================================================

DELIMITER //

CREATE PROCEDURE sp_atualizar_produto(
    IN p_id INT,
    IN p_nome VARCHAR(100),
    IN p_preco DECIMAL(10,2)
)
BEGIN

    UPDATE produtos
    SET
        nome = p_nome,
        preco = p_preco
    WHERE id = p_id;

    SELECT ROW_COUNT() AS linhasAfetadas;

END //

DELIMITER ;


-- ============================================================
-- DELETE - EXCLUIR PRODUTO
-- ============================================================

DELIMITER //

CREATE PROCEDURE sp_excluir_produto(
    IN p_id INT
)
BEGIN

    DELETE FROM produtos
    WHERE id = p_id;

    SELECT ROW_COUNT() AS linhasAfetadas;

END //

DELIMITER ;