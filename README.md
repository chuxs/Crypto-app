http://api.coinlayer.com/list?access_key=a83ff3e03467ee9c6464eaddd682ed78

output of the current API structure in the axios
ZNY: {
      symbol: 'ZNY',
      name: 'BitZeny',
      name_full: 'BitZeny (ZNY)',
      max_supply: 250000000,
      icon_url: 'https://assets.coinlayer.com/icons/ZNY.png'
    },


                const cardHTML = `
                    <div class="crypto-card">
                        <button class="remove-btn" onclick="removeCoin('${coin.id}')" title="Remove coin">×</button>
                        <div class="crypto-header">
                            <img src="${coin.image}" alt="${coin.name}" class="crypto-icon">
                            <div>
                                <div class="crypto-name">${coin.name}</div>
                                <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span>
                            </div>
                        </div>
                        <div class="crypto-price">${formatPrice(coin.current_price)}</div>

                        <div class="crypto-stats">
                            <div class="stat">
                                <div class="stat-label">Market Cap</div>
                                <div class="stat-value">$${formatNumber(coin.market_cap)}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">24h Volume</div>
                                <div class="stat-value">$${formatNumber(coin.total_volume)}</div>
                            </div>
                        </div>
                    </div>
                `;