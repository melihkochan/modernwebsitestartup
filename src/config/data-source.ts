/**
 * Configuration flag for data source switching.
 *
 * Defaults to true (serving mock data) unless NEXT_PUBLIC_USE_MOCK_DATA is explicitly set to "false".
 * This allows the frontend to run fully visual and interactive out of the box.
 */
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
