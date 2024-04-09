import { Token } from "../Interpreter/Tokenizer/Token";
import { TokenType } from "../Interpreter/Tokenizer/TokenType";
import { Tokenizer } from "../Interpreter/Tokenizer/Tokenizer";

describe('test Token', () => {
  test('test toString & constructor', () => {
    let token = new Token(TokenType.LEFT_BRACE, '(', null)
    let toStr = "22 ( null"
    expect(toStr).toEqual(token.toString())
  })

  test('test right brace', () => {
    let token = new Token(TokenType.RIGHT_BRACE, ')', null)
    let toStr = "23 ) null"
    expect(toStr).toEqual(token.toString())
  })

  test('test if', () => {
    let token = new Token(TokenType.IF, 'თუ', null)
    let toStr = "0 თუ null"
    expect(toStr).toEqual(token.toString())
  })

  test('test number', () => {
    let token = new Token(TokenType.NUMBER, '123', 123)
    let toStr = "11 123 123"
    expect(toStr).toEqual(token.toString())
  })
})

describe('test Tokenizer source', () => {
  test('test comments', () => {
    let source = `
    // first comment
// second comment
    ///////////////////
    // daspojdaslkdnqwkndslmadls ///
    `
    let tokenizer = new Tokenizer(source)
    expect(tokenizer.getSource()).toEqual("")
  })

  test('test spaces', () => {
    let source = `

              let name = 1

    `
    let tokenizer = new Tokenizer(source)
    expect(tokenizer.getSource()).toEqual("letname=1")
  })

  test('test comments and spaces', () => {
    let source = `
// first comment
        // second comment
 ///////////////////
    // daspojdaslkdnqwkndslmadls //
  რიცხვი ერთი = 1

` 
    let tokenizer = new Tokenizer(source)
    expect(tokenizer.getSource()).toEqual("რიცხვიერთი=1")
  })

  describe('test Tokenizer list', () => {

    
    // test basics parens etc
    test('test basic parens tokens', () => {
      let source = `
      ( ) 
      `
      let tokenizer = new Tokenizer(source)
      tokenizer.scanTokens()
      let tokens = tokenizer.getTokens()
      const expectedTokens = [
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.RIGHT_PAREN, ')', null),
      ]
      expect(tokens).toEqual(expectedTokens);
    })

    test('test single-chars tokens', () => {
      let source = `
      ( ) { } . 
      { ,
      };
      `
      let tokenizer = new Tokenizer(source)
      tokenizer.scanTokens()
      let tokens = tokenizer.getTokens()
      
      const expectedTokens = [
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.RIGHT_PAREN, ')', null),
        new Token(TokenType.LEFT_BRACE, '{', null),
        new Token(TokenType.RIGHT_BRACE, '}', null),
        new Token(TokenType.DOT, '.', null),
        new Token(TokenType.LEFT_BRACE, '{', null),
        new Token(TokenType.COMMA, ',', null),
        new Token(TokenType.RIGHT_BRACE, '}', null),
        new Token(TokenType.SEMICOLON, ';', null),
      ]
      expect(tokens).toEqual(expectedTokens);
    })

    // test with comments and whitespaces 
    test('test single char tokens with unnecessary chars', () => {
      let source = `
      {
        (.)
        (,
              ;

        // (){}

      }

      `
      let tokenizer = new Tokenizer(source)
      tokenizer.scanTokens()
      let tokens = tokenizer.getTokens()
      const expectedTokens = [
        new Token(TokenType.LEFT_BRACE, '{', null),
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.DOT, '.', null),
        new Token(TokenType.RIGHT_PAREN, ')', null),
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.COMMA, ',', null),
        new Token(TokenType.SEMICOLON, ';', null),

        new Token(TokenType.RIGHT_BRACE, '}', null),

      ]
      expect(tokens).toEqual(expectedTokens);
    })
  })  
})