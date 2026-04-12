import {Component, Input, OnInit} from '@angular/core';
import {tap} from "rxjs";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {CountryService} from "../../../services/country.service";
import {Country} from "../../../interfaces/entity/country";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';

@Component({
    selector: 'app-country-select',
    templateUrl: './country-select.component.html',
    styleUrls: ['./country-select.component.scss'],
    imports: [MatFormField, MatLabel, MatInput, FormsModule, MatAutocompleteTrigger, ReactiveFormsModule, MatAutocomplete, MatOption]
})
export class CountrySelectComponent implements OnInit {
  public countryAutocompleteControl: FormControl = this.formBuilder.control('');
  public allCountriesOption!: Country[];
  public filteredCountriesOptions!: Country[];
  @Input() control!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService) {
  }

  ngOnInit(): void {
    this.countryService.getOptions().pipe(
      tap(countries => {
        this.allCountriesOption = countries;
        this.filteredCountriesOptions = countries;
      })
    ).subscribe();

    this.countryAutocompleteControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.filteredCountriesOptions = this._filter(this.allCountriesOption, value);
          return;
        }
        this.control.setValue(value?.id)
        this.filteredCountriesOptions = value?.name ? this._filter(this.allCountriesOption, value.name) : this.allCountriesOption.slice();
      }),
    ).subscribe();
  }

  public displayFn(country: { name: string }): string {
    return country && country.name ? country.name : '';
  }

  private _filter(array: { name: string }[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
