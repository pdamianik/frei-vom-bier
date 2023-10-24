<script lang="ts">
    import logo from "~/assets/logo.svg";
    import { bierig } from "./bierig";

    const logoImageUrl = new URL(logo, import.meta.url).href;
</script>

{#if $bierig}
    <div class="logo">
        <img
            src={logoImageUrl}
            height="50"
            alt="A beer mug"
            title="Freibier protection active"
        />
    </div>
{/if}

<style>
    .logo {
        z-index: 99999;
        position: fixed;
        bottom: 20px;
        right: 10px;
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    img {
        position: absolute;
        top: 7px;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
        }

        70% {
            transform: scale(1.2);
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }

        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }
</style>
