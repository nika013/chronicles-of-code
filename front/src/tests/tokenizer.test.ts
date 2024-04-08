import { Token } from "../Interpreter/Tokenizer/Token";
import { TokenType } from "../Interpreter/Tokenizer/TokenType";

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

