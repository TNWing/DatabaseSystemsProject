// signIn.js

export async function handleSignIn() {
    try {
        const response = await fetch('http://localhost:4000/users/login', {
            method: 'GET',
            // You can include additional options such as headers or body data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Handle response from server
        const responseData = await response.text();
        console.log(responseData); // Assuming login page HTML is returned
    } catch (error) {
        console.error('Error:', error);
    }
}
