async function testSignup() {
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    try {
        const response = await fetch(`${baseUrl}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test' + Date.now() + '@example.com', password: 'password123' })
        });

        const status = response.status;
        const text = await response.text();
        console.log('Status:', status);
        console.log('Response:', text);
    } catch (error) {
        console.error('Fetch failed:', error.message);
    }
}

testSignup();
