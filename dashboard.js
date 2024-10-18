document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo) {
        window.location.href = 'index.html';
        return;
    }

    // 显示用户信息
    document.getElementById('username').textContent = userInfo.username;
    document.getElementById('profileUsername').textContent = userInfo.username;
    document.getElementById('email').textContent = userInfo.email;

    // 模拟加载任务数据
    setTimeout(() => {
        document.getElementById('nextLaunch').textContent = "2023年6月15日 - Starlink 任务";
        document.getElementById('missionStats').textContent = "成功发射: 100 次 | 回收火箭: 80 次";
    }, 1000);

    // 处理登出
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});
