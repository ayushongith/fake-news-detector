import nltk
import re
import string
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


def ensure_nltk_data():
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)


def lowercase(text):
    return text.lower()


def remove_punctuation(text):
    return text.translate(str.maketrans('', '', string.punctuation))


def remove_stopwords(text):
    stop_words = set(stopwords.words('english'))
    return ' '.join([w for w in text.split() if w not in stop_words])


def tokenize(text):
    return nltk.word_tokenize(text)


def lemmatize(text):
    lemmatizer = WordNetLemmatizer()
    return ' '.join([lemmatizer.lemmatize(w) for w in text.split()])


def preprocess_text(text):
    text = lowercase(text)
    text = remove_punctuation(text)
    text = remove_stopwords(text)
    text = lemmatize(text)
    return text


def preprocess_dataframe(df, text_column='text'):
    ensure_nltk_data()
    df['processed_text'] = df[text_column].apply(preprocess_text)
    return df
