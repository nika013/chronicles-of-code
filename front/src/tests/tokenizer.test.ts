import { Token } from "../Interpreter/Token";
import { TokenType } from "../Interpreter/TokenType";
import { Tokenizer } from "../Interpreter/Tokenizer/Tokenizer";


function addEOF(tokens: Token[]) {
    tokens.push(new Token(TokenType.EOF, '', ""))
}

describe('test Token', () => {
  test('test toString & constructor', () => {
    const token = new Token(TokenType.LEFT_BRACE, '(', null)
    const toStr = "22 ( null"
    expect(toStr).toEqual(token.toString())
  })

  test('test right brace', () => {
    const token = new Token(TokenType.RIGHT_BRACE, ')', null)
    const toStr = "23 ) null"
    expect(toStr).toEqual(token.toString())
  })

  test('test if', () => {
    const token = new Token(TokenType.IF, 'თუ', null)
    const toStr = "0 თუ null"
    expect(toStr).toEqual(token.toString())
  })

  test('test number', () => {
    const token = new Token(TokenType.NUMBER, '123', 123)
    const toStr = "11 123 123"
    expect(toStr).toEqual(token.toString())
  })
})



describe('test Tokenizer source', () => {
//   test('test comments', () => {
//     const source = `
//     // first comment
// // second comment
//     ///////////////////
//     // daspojdaslkdnqwkndslmadls ///
//     `
//     const tokenizer = new Tokenizer(source)
//     expect(tokenizer.getSource()).toEqual("")
//   })

  // test('test spaces', () => {
  //   const source = `
  //
  //             const name = 1
  //
  //   `
  //   const tokenizer = new Tokenizer(source)
  //   expect(tokenizer.getSource()).toEqual("constname=1")
  // })

//   test('test comments and spaces', () => {
//     const source = `
// // first comment
//         // second comment
//  ///////////////////
//     // daspojdaslkdnqwkndslmadls //
//   რიცხვი ერთი = 1
//
// ` 
//     const tokenizer = new Tokenizer(source)
//     expect(tokenizer.getSource()).toEqual("რიცხვიერთი=1")
//   })

  describe('test Tokenizer list', () => {
    // test basics parens etc
    test('test basic parens tokens', () => {
      const source = `
      ( ) 
      `
      const tokenizer = new Tokenizer(source)
      const tokens = tokenizer.scanTokens()

      const expectedTokens = [
        new Token(TokenType.LEFT_PAREN, '(', null),
        new Token(TokenType.RIGHT_PAREN, ')', null),
      ]
        
      addEOF(expectedTokens)  
      expect(tokens).toEqual(expectedTokens)
    })

    test('test single-chars tokens', () => {
      const source = `
      ( ) { } . 
      { ,
      };
      `
      const tokenizer = new Tokenizer(source)
      const tokens = tokenizer.scanTokens()

      
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
        addEOF(expectedTokens)

        expect(tokens).toEqual(expectedTokens)
    })

    // test with comments and whitespaces 
    test('test single char tokens with unnecessary chars', () => {
      const source = `
      {
        (.)
        (,
              ;

        // (){}

      }

      `

      const tokenizer = new Tokenizer(source)
      const tokens = tokenizer.scanTokens()

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
        addEOF(expectedTokens)  
      expect(tokens).toEqual(expectedTokens)
    })

    // test literal tokens
    test('test basic literals', () => {
      const source = `
        5 "number"  
      `
      const tokenizer = new Tokenizer(source)
      const tokens = tokenizer.scanTokens()

      const expectedTokens = [
        new Token(TokenType.NUMBER, '5', 5),
        new Token(TokenType.STRING, `"number"`, "number"),
      ]
        addEOF(expectedTokens)

        expect(tokens).toEqual(expectedTokens)
    })

    test('test advanced literals', () => {
      const source = `
        { 
          5, "number" 
            // no literals
            120.1
                -7.13
              "turnRight"
            
        }
      `
      const tokenizer = new Tokenizer(source)
      const tokens = tokenizer.scanTokens()

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
        addEOF(expectedTokens)

        expect(tokens).toEqual(expectedTokens)
    })

    test('test operators & 2 char tokens', () => {
      const source = `
      {
        (5 != 6), 100 == 100, 200 >= 100
        
      }
      =
        !
        > < <=
      `
      const tokenizer = new Tokenizer(source)
      const tokens = tokenizer.scanTokens()
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
        addEOF(expectedTokens)

        expect(tokens).toEqual(expectedTokens)
    })

    // test keywords
  })  
})

describe('Logical Operators Tokenization', () => {
    test('tokenizes logical AND (და)', () => {
        const source = "ჭეშმარიტი და მცდარი";
        const tokenizer = new Tokenizer(source);
        const tokens = tokenizer.scanTokens();

        const expectedTokens = [
            new Token(TokenType.TRUE, "ჭეშმარიტი", true),
            new Token(TokenType.AND, "და", "და"),
            new Token(TokenType.FALSE, "მცდარი", false),
        ];
        addEOF(expectedTokens);

        expect(tokens).toEqual(expectedTokens);
    });

    test('tokenizes logical OR (ან)', () => {
        const source = "ჭეშმარიტი ან მცდარი";
        const tokenizer = new Tokenizer(source);
        const tokens = tokenizer.scanTokens();

        const expectedTokens = [
            new Token(TokenType.TRUE, "ჭეშმარიტი", true),
            new Token(TokenType.OR, "ან", "ან"),
            new Token(TokenType.FALSE, "მცდარი", false),
        ];
        addEOF(expectedTokens);

        expect(tokens).toEqual(expectedTokens);
    });
});

describe('test Tokenizer for complex expressions with logical operators', () => {
    test('tokenize expression with numbers, logical and comparison operators', () => {
        const source = '(5 >= 5) და (3 + 2 == 5) ან (10 != 2 * 5)';
        const tokenizer = new Tokenizer(source);
        const tokens = tokenizer.scanTokens();

        const expectedTokens = [
            new Token(TokenType.LEFT_PAREN, '(', null),
            new Token(TokenType.NUMBER, '5', 5),
            new Token(TokenType.GREATER_EQUAL, '>=', null),
            new Token(TokenType.NUMBER, '5', 5),
            new Token(TokenType.RIGHT_PAREN, ')', null),
            new Token(TokenType.AND, 'და', 'და'),
            new Token(TokenType.LEFT_PAREN, '(', null),
            new Token(TokenType.NUMBER, '3', 3),
            new Token(TokenType.PLUS, '+', null),
            new Token(TokenType.NUMBER, '2', 2),
            new Token(TokenType.EQUAL_EQUAL, '==', null),
            new Token(TokenType.NUMBER, '5', 5),
            new Token(TokenType.RIGHT_PAREN, ')', null),
            new Token(TokenType.OR, 'ან', 'ან'),
            new Token(TokenType.LEFT_PAREN, '(', null),
            new Token(TokenType.NUMBER, '10', 10),
            new Token(TokenType.BANG_EQUAL, '!=', null),
            new Token(TokenType.NUMBER, '2', 2),
            new Token(TokenType.STAR, '*', null),
            new Token(TokenType.NUMBER, '5', 5),
            new Token(TokenType.RIGHT_PAREN, ')', null),
            new Token(TokenType.EOF, '', '')
        ];

        expect(tokens).toEqual(expectedTokens);
    });
});
