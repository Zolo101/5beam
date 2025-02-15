<script context="module">
    import { page } from "$app/stores";
</script>

<script>
    // import ErrorScreen from '../components/screens/ErrorScreen.svelte'; // your own Error screen component
    // import NotFoundScreen from '../components/screens/NotFoundScreen.svelte'; // your own 404 screen component
</script>

<div class="text-white">
    <p class="status">{$page.status}</p>
    <p class="message">{$page.error.message}</p>
</div>

<style>
    .status,
    .message {
        @apply m-0 text-center;
    }

    .status {
        text-shadow: 10px 10px black;
        font-size: 10em;
        font-weight: bold;
    }

    .message {
        font-size: 2em;
        padding-bottom: 50px;
    }
</style>
