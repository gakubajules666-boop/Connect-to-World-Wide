// Dashboard JavaScript

let userData = {
    totalEarnings: 0,
    todayViews: 0,
    weekViews: 0,
    videos: []
};

function loadDashboardData() {
    // Load from localStorage
    userData.totalEarnings = parseFloat(localStorage.getItem('totalEarnings')) || 0;
    userData.todayViews = parseInt(localStorage.getItem('todayViews')) || 0;
    userData.videos = JSON.parse(localStorage.getItem('videos')) || [];
    
    const todayEarnings = userData.todayViews * 0.005;
    const currentRate = todayEarnings;
    const monthlyProjection = currentRate * 30;
    const yearlyProjection = currentRate * 365;
    
    // Update dashboard numbers
    const elements = {
        todayViews: userData.todayViews,
        todayEarningsDash: `$${todayEarnings.toFixed(4)}`,
        weekEarnings: `$${(userData.todayViews * 0.005).toFixed(2)}`,
        totalEarningsDash: `$${userData.totalEarnings.toFixed(2)}`,
        currentRate: currentRate.toFixed(4),
        monthlyProj: monthlyProjection.toFixed(2),
        yearlyProj: yearlyProjection.toFixed(2)
    };
}
