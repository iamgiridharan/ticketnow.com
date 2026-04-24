import React, { useState } from 'react';

const PaymentModal = ({ event, tickets, totalAmount, onSuccess, onCancel }) => {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'number') v = formatCardNumber(value);
    if (name === 'expiry') v = formatExpiry(value);
    if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 3);
    setCardData(prev => ({ ...prev, [name]: v }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (cardData.number.replace(/\s/g, '').length < 16) errs.number = 'Enter a valid 16-digit card number.';
    if (cardData.expiry.length < 5) errs.expiry = 'Enter valid expiry MM/YY.';
    if (cardData.cvv.length < 3) errs.cvv = 'Enter 3-digit CVV.';
    if (!cardData.name.trim()) errs.name = 'Enter name on card.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess(), 2500);
    }, 2500);
  };

  const getCardBrand = () => {
    const num = cardData.number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mc';
    if (num.startsWith('6')) return 'rupay';
    return null;
  };
  const brand = getCardBrand();

  return (
    <div className="payment-overlay">
      <div className="payment-modal">

        {/* Header */}
        <div className="payment-header">
          <span className="payment-logo">🎫 TicketNow</span>
          {step === 'checkout' && (
            <button className="payment-close-btn" onClick={onCancel} title="Cancel">✕</button>
          )}
        </div>

        {/* ── CHECKOUT ── */}
        {step === 'checkout' && (
          <>
            <div className="payment-summary-box">
              <div className="ps-event">{event.name}</div>
              <div className="ps-meta">{tickets} ticket{tickets > 1 ? 's' : ''} × ${event.price}</div>
              <div className="ps-total">${totalAmount} <span className="ps-currency">USD</span></div>
            </div>

            <div className="payment-divider" />

            {/* Card Brand Icons */}
            <div className="card-brands">
              <span className={`cb ${brand === 'visa' ? 'cb-active' : ''}`}>VISA</span>
              <span className={`cb ${brand === 'mc' ? 'cb-active' : ''}`}>MC</span>
              <span className={`cb ${brand === 'rupay' ? 'cb-active' : ''}`}>RuPay</span>
              <span className="cb">UPI</span>
            </div>

            <div className="payment-form-body">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" name="number" value={cardData.number}
                  onChange={handleChange} placeholder="4111 1111 1111 1111" maxLength={19} />
                {errors.number && <p className="field-error">{errors.number}</p>}
              </div>

              <div className="payment-row-2">
                <div className="form-group">
                  <label>Expiry</label>
                  <input type="text" name="expiry" value={cardData.expiry}
                    onChange={handleChange} placeholder="MM/YY" maxLength={5} />
                  {errors.expiry && <p className="field-error">{errors.expiry}</p>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="password" name="cvv" value={cardData.cvv}
                    onChange={handleChange} placeholder="•••" maxLength={3} />
                  {errors.cvv && <p className="field-error">{errors.cvv}</p>}
                </div>
              </div>

              <div className="form-group">
                <label>Name on Card</label>
                <input type="text" name="name" value={cardData.name}
                  onChange={handleChange} placeholder="Your full name" />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="test-card-hint">
                💡 <strong>Demo card:</strong> 4111 1111 1111 1111 · Expiry: 12/28 · CVV: 123
              </div>

              <button className="pay-btn" onClick={handlePay}>
                🔒 Pay ${totalAmount}
              </button>
            </div>
          </>
        )}

        {/* ── PROCESSING ── */}
        {step === 'processing' && (
          <div className="payment-state">
            <div className="payment-spinner" />
            <p className="ps-state-title">Processing Payment...</p>
            <p className="ps-state-sub">Please do not close this window.</p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="payment-state">
            <div className="payment-success-ring">
              <div className="payment-success-check">✓</div>
            </div>
            <p className="ps-state-title" style={{ color: '#4ade80' }}>Payment Successful!</p>
            <p className="ps-state-sub">Confirming your booking...</p>
          </div>
        )}

        <div className="payment-footer-bar">
          🔒 Secured by <strong>Razorpay</strong>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
