<script lang="ts">
    export let text = "5beam"
    $: first = text.slice(0, 2)
    $: second = text.substring(2)
</script>

<span class="font-extrabold">{first}</span><span>{second}</span>