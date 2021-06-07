import { APIGatewayProxyHandler } from "aws-lambda";

import { v4 as uuid } from "uuid";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  const todo_id = uuid();

  console.log(todo_id, title, deadline);

  await document
    .put({
      TableName: "todos",
      Item: {
        id: todo_id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created successfully!",
      todo: {
        id: todo_id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline),
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
