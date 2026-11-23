import gql from "graphql-tag";

export const AuthSchema = gql`
  extend type Query {
    """
    Gets new refresh token
    """
    refreshToken(refreshToken: String!): RefreshTokenResponse!
    testContext: JSON
  }

  type BaseResponse {
    success: Boolean!
    message: String!
  }

  type RefreshTokenResponse {
    success: Boolean!
    message: String!
    accessToken: String
  }

  extend type CurrentUser {
    accessToken: String
    refreshToken: String
  }

  extend type Mutation {
    """
    Deletes the current customer account (soft delete)
    """
    deleteCustomerAccount: AuthDeletionResponse!

    """
    Step 1 of phone-based password recovery: sends a one-time code via SMS.
    Always returns success when the request is accepted (no account enumeration).
    """
    requestPhonePasswordReset(phoneNumber: String!): BaseResponse!

    """
    Step 2 of phone-based password recovery: verifies the OTP and sets a new
    password. Throws on invalid/expired/locked codes or weak passwords.
    """
    resetPasswordByPhone(
      phoneNumber: String!
      code: String!
      newPassword: String!
    ): BaseResponse!
  }

  type AuthDeletionResponse {
    result: AuthDeletionResult!
    message: String
  }

  enum AuthDeletionResult {
    DELETED
    NOT_DELETED
  }
`;
