<script lang="ts">
    interface Props {
        text?: string;
    }

    let { text = "5beam" }: Props = $props();
    let first = $derived(text.slice(0, 2));
    let second = $derived(text.substring(2));
</script>

<span class="font-extrabold">{first}</span><span>{second}</span>
