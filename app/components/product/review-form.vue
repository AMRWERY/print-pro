<template>
  <form
    class="card space-y-4 p-5"
    novalidate
    aria-labelledby="review-form-title"
    @submit.prevent="submit"
  >
    <h3 id="review-form-title" class="text-lg">Rate this product</h3>

    <fieldset class="space-y-1.5">
      <legend class="text-sm font-medium">
        Your rating <span class="text-accent" aria-hidden="true">*</span>
      </legend>
      <div class="flex w-fit gap-0.5" @mouseleave="hovered = 0">
        <label
          v-for="n in 5"
          :key="n"
          class="relative cursor-pointer rounded p-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-accent"
          @mouseenter="hovered = n"
        >
          <input
            v-model="rating"
            type="radio"
            name="review-rating"
            class="sr-only"
            :value="n"
            :aria-label="`${n} out of 5 stars`"
            :aria-invalid="ratingError ? 'true' : undefined"
            :aria-describedby="ratingError ? 'review-rating-error' : undefined"
            @change="ratingError = ''"
          />
          <Icon
            :name="
              n <= (hovered || rating)
                ? 'material-symbols-light:kid-star-sharp'
                : 'material-symbols-light:kid-star-outline-sharp'
            "
            size="28"
            class="transition-transform duration-150 motion-reduce:transition-none"
            :class="
              n <= (hovered || rating) ? 'scale-110 text-yellow' : 'text-mute'
            "
            aria-hidden="true"
          />
        </label>
      </div>
      <p
        v-if="ratingError"
        id="review-rating-error"
        class="flex items-start gap-1.5 text-xs text-accent"
        role="alert"
      >
        <Icon
          name="lucide:circle-alert"
          size="14"
          class="mt-px shrink-0"
          aria-hidden="true"
        />{{ ratingError }}
      </p>
    </fieldset>

    <LazyVInput
      v-model="author"
      name="review-author"
      label="Your name"
      required
      autocomplete="name"
      :rules="requiredText('Enter the name to show beside your review.')"
    />

    <LazyVInput
      v-model="title"
      name="review-title"
      label="Headline"
      optional
      maxlength="80"
      placeholder="Sum up your experience"
    />

    <LazyVTextarea
      v-model="body"
      name="review-body"
      label="Your review"
      required
      rows="4"
      maxlength="1000"
      :rules="
        minLengthText(
          10,
          'Tell other customers a little more (at least 10 characters).',
        )
      "
      placeholder="What did you use it for, and how did it perform?"
    />

    <div class="flex justify-end">
      <LazyVButton type="submit" :loading="saving">{{
        t("btn.submit_review")
      }}</LazyVButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps<{ productId: string }>();

const emit = defineEmits<{ submitted: [] }>();

const store = useReviewStore();
const auth = useAuthStore();
const toast = useToast();
const { validate, resetForm } = useForm();

const rating = ref(0);
const hovered = ref(0);
const ratingError = ref("");
const author = ref("");
const title = ref("");
const body = ref("");
const saving = ref(false);

// Signed-in customers get their name filled in; they can still change it.
watch(
  () => auth.user?.name,
  (name) => {
    if (name && !author.value) author.value = name;
  },
  { immediate: true },
);

const submit = async () => {
  ratingError.value = rating.value ? "" : "Choose a star rating from 1 to 5.";
  const result = await validate();
  if (!result.valid || ratingError.value) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  const name = author.value.trim();
  saving.value = true;
  await simulateRequest();
  store.add(props.productId, {
    author: author.value.trim(),
    rating: rating.value,
    title: String(title.value ?? "").trim(),
    body: String(body.value).trim(),
  });
  saving.value = false;

  rating.value = 0;
  title.value = "";
  body.value = "";
  resetForm();
  await nextTick();
  author.value = name;
  toast.success("Thanks, your review is live");
  emit("submitted");
};
</script>