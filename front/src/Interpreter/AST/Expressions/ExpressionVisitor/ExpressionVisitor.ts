import {Binary} from "../ConcreteExpressions/Binary";
import {Unary} from "../ConcreteExpressions/Unary";
import {Grouping} from "../ConcreteExpressions/Grouping";
import {Literal} from "../ConcreteExpressions/Literal";

export interface ExpressionVisitor<R> {
    visitBinaryExpr(binaryExpr: Binary) : R
    visitUnaryExpr(unaryExpr: Unary): R
    visitGroupingExpr(groupingExpr: Grouping): R
    visitLiteralExpr(literalExpr: Literal): R
}