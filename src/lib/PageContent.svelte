<script lang="ts">
    import logo from "~/assets/logo.svg";

    const imageUrl = new URL(logo, import.meta.url).href;
</script>

<img src={imageUrl} height="80" alt="" />
<h1>
    <slot />
</h1>
<a href="https://streamlinehq.com">Free icons from Streamline</a>
