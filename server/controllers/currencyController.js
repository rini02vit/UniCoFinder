import { fetchLiveExchangeRates } from '../services/currencyService.js';

// @desc    Get currency exchange rates
// @route   GET /api/currency/rates
// @access  Public
export const getExchangeRates = async (req, res) => {
  try {
    let { base } = req.query;
    
    // Validate base currency format (3 uppercase letters)
    if (base) {
      base = base.toUpperCase();
      if (!/^[A-Z]{3}$/.test(base)) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [{ field: 'base', message: 'Invalid base currency code.' }]
        });
      }
    } else {
      base = 'USD';
    }

    const rates = await fetchLiveExchangeRates(base);

    return res.status(200).json({
      success: true,
      message: 'Currency exchange rates fetched successfully.',
      data: { rates }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: 'Exchange rates currently unavailable.',
      errors: [{ field: 'server', message: error.message }]
    });
  }
};
