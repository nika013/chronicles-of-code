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
      let tokens = tokenizer.scanTokens()

      const expectedTokens = [
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.RIGHT_PAREN, ')', null),
      ]
      expect(tokens).toEqual(expectedTokens)
    })

    test('test single-chars tokens', () => {
      let source = `
      ( ) { } . 
      { ,
      };
      `
      let tokenizer = new Tokenizer(source)
      let tokens = tokenizer.scanTokens()

      
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
      expect(tokens).toEqual(expectedTokens)
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
      let tokens = tokenizer.scanTokens()

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
      expect(tokens).toEqual(expectedTokens)
    })

    // test literal tokens
    test('test basic literals', () => {
      let source = `
        5 "number"  
      `
      let tokenizer = new Tokenizer(source)
      let tokens = tokenizer.scanTokens()

      const expectedTokens = [
        new Token(TokenType.NUMBER, '5', 5),
        new Token(TokenType.STRING, `"number"`, "number"),
      ]
      expect(tokens).toEqual(expectedTokens)
    })

    test('test advanced literals', () => {
      let source = `
        { 
          5, "number" 
            // no literals
            120.1
                -7.13
              "turnRight"
            
        }
      `
      let tokenizer = new Tokenizer(source)
      let tokens = tokenizer.scanTokens()

      const expectedTokens = [
        new Token(TokenType.LEFT_BRACE, '{', null),
        new Token(TokenType.NUMBER, '5', 5),
        new Token(TokenType.COMMA, ',', null),
        new Token(TokenType.STRING, `"number"`, "number"),
        new Token(TokenType.NUMBER, '120.1', 120.1),
        new Token(TokenType.MINUS, '-', null),
        new Token(TokenType.NUMBER, '7.13', 7.13),
        new Token(TokenType.STRING, `"turnRight"`, "turnRight"),
        new Token(TokenType.RIGHT_BRACE, '}', null),
      ]
      expect(tokens).toEqual(expectedTokens)
    })

    test('test operators & 2 char tokens', () => {
      let source = `
      {
        (5 != 6), 100 == 100, 200 >= 100
        
      }
      =
        !
        > < <=
      `
      let tokenizer = new Tokenizer(source)
      let tokens = tokenizer.scanTokens()
      const expectedTokens = [
        new Token(TokenType.LEFT_BRACE, '{', null),
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.NUMBER, '5', 5),
        new Token(TokenType.BANG_EQUAL, '!=', null),
        new Token(TokenType.NUMBER, '6', 6),
        new Token(TokenType.RIGHT_PAREN, ')', null),
        new Token(TokenType.COMMA, ',', null),
        new Token(TokenType.NUMBER, '100', 100),
        new Token(TokenType.EQUAL_EQUAL, '==', null),
        new Token(TokenType.NUMBER, '100', 100),
        new Token(TokenType.COMMA, ',', null),
        new Token(TokenType.NUMBER, '200', 200),
        new Token(TokenType.GREATER_EQUAL, '>=', null),
        new Token(TokenType.NUMBER, '100', 100),
        new Token(TokenType.RIGHT_BRACE, '}', null),
        new Token(TokenType.EQUAL, '=', null),
        new Token(TokenType.BANG, '!', null),
        new Token(TokenType.GREATER, '>', null),
        new Token(TokenType.LESS, '<', null),
        new Token(TokenType.LESS_EQUAL, '<=', null),
      ]
      expect(tokens).toEqual(expectedTokens)
    })

    // test identifiers
    test('test identifiers', () => {
      //         წიქარა.ახტომა()
      //  რიცხვი ასი = 100
      let source = `
      {
        წინ()
      }
      `
      let tokenizer = new Tokenizer(source)
      let tokens = tokenizer.scanTokens()
      const expectedTokens = [
        new Token(TokenType.LEFT_BRACE, '{', null),
        new Token(TokenType.IDENTIFIER, 'წინ', null),
        new Token(TokenType.LEFT_PAREN, '(', null),
        // new Token(TokenType.EQUAL, '=', null),
        // new Token(TokenType.NUMBER, '100', 100),
        new Token(TokenType.RIGHT_PAREN, ')', null),
        new Token(TokenType.RIGHT_BRACE, '}', null),
      ]
      expect(tokens).toEqual(expectedTokens)
    })

    // test keywords
  })  
})